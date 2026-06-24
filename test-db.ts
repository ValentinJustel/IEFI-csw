import { prisma } from './lib/prisma'

async function main() {
  try {
    // Primero, intenta una operación simple
    const count = await prisma.user.count()
    console.log('✅ Conexión exitosa. Usuarios en DB:', count)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main()