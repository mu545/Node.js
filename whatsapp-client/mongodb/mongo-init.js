// Whatsapp Database
db = db.getSiblingDB('whatsapp')

db.createUser({
  user: 'whatsapp',
  pwd: 'whatsapp',
  roles: [
    {
      role: 'readWrite',
      db: 'whatsapp',
    },
  ],
})
