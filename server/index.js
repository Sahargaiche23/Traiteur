import express from 'express'
import cors from 'cors'
import pkg from '@prisma/client'
const { PrismaClient } = pkg
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'yoldez-chouaib-secret-key'

app.use(cors())
app.use(express.json())

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// ============ DISHES ROUTES ============
app.get('/api/dishes', async (req, res) => {
  try {
    const { category, search, sort } = req.query
    const where = {}
    
    if (category && category !== 'all') {
      where.category = { slug: category }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    let orderBy = {}
    if (sort === 'price-low') orderBy = { price: 'asc' }
    else if (sort === 'price-high') orderBy = { price: 'desc' }
    else if (sort === 'rating') orderBy = { rating: 'desc' }
    else orderBy = { reviews: 'desc' }
    
    const dishes = await prisma.dish.findMany({
      where,
      orderBy,
      include: { category: true }
    })
    res.json(dishes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/dishes/:id', async (req, res) => {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    })
    if (!dish) return res.status(404).json({ error: 'Plat non trouvé' })
    res.json(dish)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/dishes', async (req, res) => {
  try {
    const { name, nameAr, description, price, image, portions, isPopular, isAvailable, categoryId } = req.body
    
    // Validate required fields
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Nom et catégorie requis' })
    }
    
    const dish = await prisma.dish.create({
      data: {
        name,
        nameAr: nameAr || '',
        description: description || '',
        price: parseFloat(price) || 0,
        image: image || '',
        portions: Array.isArray(portions) ? portions : (portions ? portions.split(',').map(p => p.trim()) : []),
        isPopular: isPopular || false,
        isAvailable: isAvailable !== false,
        categoryId
      },
      include: { category: true }
    })
    res.status(201).json(dish)
  } catch (error) {
    console.error('Error creating dish:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/dishes/:id', async (req, res) => {
  try {
    // Extract only updatable fields
    const { name, nameAr, description, price, image, portions, isPopular, isAvailable, rating, reviews, categoryId } = req.body
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (nameAr !== undefined) updateData.nameAr = nameAr
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (image !== undefined) updateData.image = image
    if (portions !== undefined) updateData.portions = portions
    if (isPopular !== undefined) updateData.isPopular = isPopular
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable
    if (rating !== undefined) updateData.rating = parseFloat(rating)
    if (reviews !== undefined) updateData.reviews = parseInt(reviews)
    if (categoryId !== undefined) updateData.categoryId = categoryId
    
    const dish = await prisma.dish.update({
      where: { id: req.params.id },
      data: updateData,
      include: { category: true }
    })
    res.json(dish)
  } catch (error) {
    console.error('Error updating dish:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/dishes/:id', async (req, res) => {
  try {
    await prisma.dish.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ ORDERS ROUTES ============
app.get('/api/orders', async (req, res) => {
  try {
    const { customerId, status } = req.query
    const where = {}
    if (customerId) where.customerId = customerId
    if (status) where.status = status.toUpperCase()
    
    const orders = await prisma.order.findMany({
      where,
      include: { customer: true, items: { include: { dish: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: { include: { dish: true } } }
    })
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, address, phone, notes, deliveryDate, deliveryTime, customerId: existingCustomerId } = req.body
    
    let customerId = existingCustomerId
    
    // If customer object is provided (from frontend), create or find the customer
    if (customer && !customerId) {
      const customerEmail = customer.email || `guest_${Date.now()}@temp.com`
      
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: customerEmail }
      })
      
      if (existingCustomer) {
        customerId = existingCustomer.id
        // Update customer info if needed
        await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            firstName: customer.firstName || existingCustomer.firstName,
            lastName: customer.lastName || existingCustomer.lastName,
            phone: customer.phone || phone || existingCustomer.phone,
            address: customer.address || address || existingCustomer.address
          }
        })
      } else {
        const newCustomer = await prisma.customer.create({
          data: {
            firstName: customer.firstName || 'Client',
            lastName: customer.lastName || '',
            email: customerEmail,
            phone: customer.phone || phone || '',
            address: customer.address || address || ''
          }
        })
        customerId = newCustomer.id
      }
    }
    
    // Format items for Prisma - validate dishIds exist
    const orderItems = []
    for (const item of items) {
      const dishId = item.dishId || item.id
      // Verify dish exists
      const dish = await prisma.dish.findUnique({ where: { id: dishId } })
      if (dish) {
        orderItems.push({
          dishId,
          quantity: item.quantity || 1,
          price: parseFloat(item.price) || 0,
          portion: item.portion || item.selectedPortion || ''
        })
      } else {
        console.warn(`Dish ${dishId} not found, skipping item`)
      }
    }
    
    if (orderItems.length === 0) {
      return res.status(400).json({ error: 'Aucun article valide dans la commande' })
    }
    
    const order = await prisma.order.create({
      data: {
        customerId,
        total: parseFloat(total) || 0,
        address: address || customer?.address || '',
        phone: phone || customer?.phone || '',
        notes: notes || '',
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        deliveryTime: deliveryTime || null,
        items: {
          create: orderItems
        }
      },
      include: { customer: true, items: { include: { dish: true } } }
    })
    res.status(201).json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: status.toUpperCase() },
      include: { customer: true, items: { include: { dish: true } } }
    })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ SAVED MENUS ROUTES ============
app.get('/api/menus', async (req, res) => {
  try {
    const { customerId } = req.query
    const where = customerId ? { customerId } : {}
    const menus = await prisma.savedMenu.findMany({ where })
    res.json(menus)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/menus', async (req, res) => {
  try {
    const menu = await prisma.savedMenu.create({ data: req.body })
    res.status(201).json(menu)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/menus/:id', async (req, res) => {
  try {
    await prisma.savedMenu.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ POSTS ROUTES ============
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { comments: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/posts', async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: req.body,
      include: { comments: true }
    })
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/posts/:id', async (req, res) => {
  try {
    // Extract only updatable fields
    const { content, image, likes } = req.body
    const updateData = {}
    if (content !== undefined) updateData.content = content
    if (image !== undefined) updateData.image = image
    if (likes !== undefined) updateData.likes = parseInt(likes)
    
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: updateData,
      include: { comments: true }
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { likes: { increment: 1 } },
      include: { comments: true }
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { userName, text, userImage } = req.body
    const comment = await prisma.comment.create({
      data: {
        postId: req.params.id,
        userName: userName || 'Anonyme',
        userImage: userImage || null,
        text: text || ''
      }
    })
    // Return updated post with all comments
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { comments: true }
    })
    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(500).json({ error: error.message })
  }
})

// ============ CUSTOMERS ROUTES ============
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(customers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/customers', async (req, res) => {
  try {
    const customer = await prisma.customer.create({ data: req.body })
    res.status(201).json(customer)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email déjà utilisé' })
    }
    res.status(500).json({ error: error.message })
  }
})

// ============ AUTH ROUTES ============
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await prisma.adminUser.findUnique({ where: { email } })
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }
    
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' })
    res.json({ token, user: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/admin/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await prisma.adminUser.create({
      data: { email, password: hashedPassword, name }
    })
    res.status(201).json({ id: admin.id, email: admin.email, name: admin.name })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email déjà utilisé' })
    }
    res.status(500).json({ error: error.message })
  }
})

// ============ SETTINGS ROUTES ============
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 'main' } })
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 'main' } })
    }
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'main' },
      update: req.body,
      create: { id: 'main', ...req.body }
    })
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ CATEGORIES ROUTES ============
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { dishes: true } } }
    })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ STATS ROUTES (Admin) ============
app.get('/api/stats', async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalDishes, totalCustomers, totalPosts] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.dish.count(),
      prisma.customer.count(),
      prisma.post.count()
    ])
    
    const revenueResult = await prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true }
    })
    const totalRevenue = revenueResult._sum.total || 0
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      avgOrderValue,
      totalDishes,
      totalCustomers,
      totalPosts
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ MESSAGES/CONTACT ROUTES ============
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    const newMessage = await prisma.message.create({
      data: { name, email, phone, subject, message }
    })
    res.status(201).json(newMessage)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { isRead: true }
    })
    res.json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ REVIEWS ROUTES ============
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/reviews/all', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/reviews', async (req, res) => {
  try {
    const { orderId, customerName, customerCity, rating, comment } = req.body
    
    // Check if review already exists for this order
    const existingReview = await prisma.review.findUnique({
      where: { orderId }
    })
    
    if (existingReview) {
      // Update existing review
      const review = await prisma.review.update({
        where: { orderId },
        data: {
          customerName,
          customerCity,
          rating: parseInt(rating) || 5,
          comment,
          isApproved: false // Reset approval on update
        }
      })
      return res.json(review)
    }
    
    const review = await prisma.review.create({
      data: {
        orderId,
        customerName,
        customerCity,
        rating: parseInt(rating) || 5,
        comment
      }
    })
    res.status(201).json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    res.status(500).json({ error: error.message })
  }
})

app.patch('/api/reviews/:id/approve', async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    })
    res.json(review)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🗄️  Database: PostgreSQL via Prisma`)
})
