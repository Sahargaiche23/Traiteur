import pkg from '@prisma/client'
const { PrismaClient } = pkg
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'plats-principaux' },
      update: {},
      create: { name: 'Plats Principaux', nameAr: 'الأطباق الرئيسية', slug: 'plats-principaux' }
    }),
    prisma.category.upsert({
      where: { slug: 'couscous' },
      update: {},
      create: { name: 'Couscous', nameAr: 'كسكسي', slug: 'couscous' }
    }),
    prisma.category.upsert({
      where: { slug: 'grillades' },
      update: {},
      create: { name: 'Grillades', nameAr: 'مشويات', slug: 'grillades' }
    }),
    prisma.category.upsert({
      where: { slug: 'salades' },
      update: {},
      create: { name: 'Salades & Entrées', nameAr: 'سلطات ومقبلات', slug: 'salades' }
    }),
    prisma.category.upsert({
      where: { slug: 'desserts' },
      update: {},
      create: { name: 'Desserts', nameAr: 'حلويات', slug: 'desserts' }
    }),
    prisma.category.upsert({
      where: { slug: 'boissons' },
      update: {},
      create: { name: 'Boissons', nameAr: 'مشروبات', slug: 'boissons' }
    }),
    prisma.category.upsert({
      where: { slug: 'evenements' },
      update: {},
      create: { name: 'Menus Événements', nameAr: 'قوائم المناسبات', slug: 'evenements' }
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Get category IDs
  const catMap = {}
  for (const cat of categories) {
    catMap[cat.slug] = cat.id
  }

  // Create dishes
  const dishesData = [
    {
      name: 'Couscous Royal',
      nameAr: 'كسكسي ملكي',
      description: 'Couscous traditionnel avec agneau, poulet et merguez, accompagné de légumes frais',
      price: 35,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      categoryId: catMap['couscous'],
      rating: 4.9,
      reviews: 124,
      portions: ['Individuelle', 'Familiale (4 pers)', 'Grande (8 pers)'],
      isPopular: true,
    },
    {
      name: 'Tajine Zitoune',
      nameAr: 'طاجين زيتون',
      description: 'Tajine de poulet aux olives vertes et citrons confits, sauce onctueuse',
      price: 28,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800',
      categoryId: catMap['plats-principaux'],
      rating: 4.8,
      reviews: 89,
      portions: ['Individuelle', 'Pour 2', 'Familiale'],
      isPopular: true,
    },
    {
      name: 'Mechouia',
      nameAr: 'مشوية',
      description: "Salade de poivrons et tomates grillés, ail et huile d'olive",
      price: 12,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      categoryId: catMap['salades'],
      rating: 4.7,
      reviews: 156,
      portions: ['Petite', 'Grande'],
      isPopular: true,
    },
    {
      name: "Brik à l'Oeuf",
      nameAr: 'بريك بالبيض',
      description: "Feuille de brik croustillante farcie d'œuf, thon, câpres et persil",
      price: 8,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      categoryId: catMap['salades'],
      rating: 4.6,
      reviews: 98,
      portions: ['1 pièce', '3 pièces', '6 pièces'],
    },
    {
      name: "Méchoui d'Agneau",
      nameAr: 'مشوي خروف',
      description: 'Agneau entier rôti lentement aux épices traditionnelles',
      price: 180,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      categoryId: catMap['grillades'],
      rating: 5.0,
      reviews: 67,
      portions: ['Demi', 'Entier'],
      isPopular: true,
    },
    {
      name: 'Brochettes Mixtes',
      nameAr: 'أسياخ مشكلة',
      description: 'Assortiment de brochettes: bœuf, poulet et kefta aux herbes',
      price: 32,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      categoryId: catMap['grillades'],
      rating: 4.8,
      reviews: 112,
      portions: ['6 pièces', '12 pièces', '24 pièces'],
      isPopular: true,
    },
    {
      name: 'Makroud',
      nameAr: 'مقروض',
      description: 'Pâtisserie traditionnelle aux dattes et au miel',
      price: 15,
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800',
      categoryId: catMap['desserts'],
      rating: 4.9,
      reviews: 203,
      portions: ['6 pièces', '12 pièces', '24 pièces'],
      isPopular: true,
    },
    {
      name: 'Baklawa Tunisienne',
      nameAr: 'بقلاوة تونسية',
      description: 'Assortiment de pâtisseries feuilletées aux amandes et pistaches',
      price: 22,
      image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800',
      categoryId: catMap['desserts'],
      rating: 4.8,
      reviews: 87,
      portions: ['500g', '1kg', '2kg'],
    },
    {
      name: 'Citronnade Maison',
      nameAr: 'عصير ليمون منزلي',
      description: 'Limonade fraîche à la menthe et fleur d\'oranger',
      price: 6,
      image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800',
      categoryId: catMap['boissons'],
      rating: 4.7,
      reviews: 145,
      portions: ['Verre', 'Carafe 1L'],
    },
    {
      name: 'Thé à la Menthe',
      nameAr: 'شاي بالنعناع',
      description: 'Thé vert traditionnel aux pignons de pin',
      price: 8,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800',
      categoryId: catMap['boissons'],
      rating: 4.9,
      reviews: 178,
      portions: ['Théière individuelle', 'Théière familiale'],
      isPopular: true,
    },
  ]

  for (const dish of dishesData) {
    await prisma.dish.upsert({
      where: { id: dish.name.toLowerCase().replace(/\s+/g, '-') },
      update: dish,
      create: dish,
    })
  }
  console.log(`✅ Created ${dishesData.length} dishes`)

  // Create posts
  const postsData = [
    {
      content: 'Nouveau plat du jour: Couscous aux légumes de saison! Venez le découvrir 🍽️',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      likes: 45,
    },
    {
      content: 'Préparation d\'un mariage pour 200 personnes ce weekend! Notre équipe est prête 👨‍🍳',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      likes: 89,
    },
    {
      content: 'Nos makrouds faits maison sont prêts pour les fêtes! Commandez maintenant 🎉',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800',
      likes: 123,
    },
  ]

  for (const post of postsData) {
    await prisma.post.create({ data: post })
  }
  console.log(`✅ Created ${postsData.length} posts`)

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'Yoldes.ch82@gmail.com' },
    update: {},
    create: {
      email: 'Yoldes.ch82@gmail.com',
      password: hashedPassword,
      name: 'Administrateur',
    },
  })
  console.log('✅ Created admin user: Yoldes.ch82@gmail.com / admin123')

  // Create default settings
  await prisma.settings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      restaurantName: 'Traiteur Yoldez Chouaib',
      phone: '+21623632664',
      email: 'Yoldes.ch82@gmail.com',
      address: 'Tunis, Sousse',
      deliveryFee: 7,
      freeDeliveryThreshold: 50,
      openingHours: '8h - 22h',
      whatsappNumber: '+21623632664',
    },
  })
  console.log('✅ Created default settings')

  console.log('\n🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
