import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error(
    "Falta la variable de entorno MONGODB_URI. Añádela en la configuración del proyecto.",
  )
}

const dbName = process.env.MONGODB_DB || "habitly"

// Reutilizamos la conexión entre recargas en desarrollo para evitar
// agotar el límite de conexiones de MongoDB.
let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise
  return connectedClient.db(dbName)
}

export default clientPromise
