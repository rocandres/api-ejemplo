const { db } = require('../src/db')

const DATOS = [
  ['Crypto Carlos', 'TECNOLOGIA', 'Promete triplicar tu dinero con una moneda que se llama como su perro.', 87],
  ['Gurú del Blockchain', 'TECNOLOGIA', 'Todo lo resuelve con blockchain, incluso la tortilla de patatas.', 54],
  ['IA Milagrosa', 'TECNOLOGIA', 'Vende un curso de prompts que "reemplaza a tu jefe en 7 días".', 63],
  ['NFT Nacho', 'TECNOLOGIA', 'Vende capturas de pantalla de monos aburridos por miles de euros.', 41],
  ['Hacker de Instagram', 'TECNOLOGIA', 'Recupera cuentas hackeadas por 50 euros y sin garantías.', 12],
  ['Trader Millonario', 'FINANZAS', 'Gana 10.000 euros al mes desde la playa, según sus stories.', 120],
  ['Rey del Dropshipping', 'FINANZAS', 'Te enseña a vender lo que él mismo compra en AliExpress.', 76],
  ['Maestro del Forex', 'FINANZAS', 'Su método infalible solo falla cuando operas tú.', 58],
  ['Libertad Financiera SL', 'FINANZAS', 'Pirámide con forma de comunidad exclusiva de Telegram.', 99],
  ['Inversor Pro', 'FINANZAS', 'Alquila un Lamborghini para grabar el anuncio de su curso.', 69],
  ['Doctor Detox', 'SALUD', 'Un zumo verde cura todo, desde la gripe hasta el mal de amores.', 45],
  ['Ayuno Eterno', 'SALUD', 'Comer es para débiles; su curso cuesta lo que no te vas a gastar en comida.', 33],
  ['Pulsera Cuántica', 'SALUD', 'Equilibra tu energía vibracional por solo 99,99 euros.', 81],
  ['Suplemento X', 'SALUD', 'Quema grasa mientras duermes. Efectos secundarios: tu cartera.', 28],
  ['Nutri Mágico', 'SALUD', 'Elimina el gluten, el azúcar, la lactosa y la alegría.', 19],
  ['Growth Hacker', 'MARKETING', 'Consigue 1 millón de seguidores, la mitad bots y la otra mitad su familia.', 37],
  ['Embudo Infinito', 'MARKETING', 'Tiene un embudo para vender cursos sobre cómo hacer embudos.', 52],
  ['Experto en SEO', 'MARKETING', 'Te posiciona el primero en Google, pero de su propia web.', 24],
  ['Influencer de Humo', 'MARKETING', 'Recomienda productos que jamás ha probado ni probará.', 60],
  ['Copywriter Supremo', 'MARKETING', 'Escribe "últimas plazas" en cada email desde hace cinco años.', 47],
  ['Coach Cuántico', 'COACHING', 'Despierta tu potencial interior en un retiro de fin de semana.', 71],
  ['Mentor de Éxito', 'COACHING', 'Su único éxito demostrable es vender mentorías de éxito.', 66],
  ['Mindset Millonario', 'COACHING', 'Madruga a las 4 AM, se ducha con agua helada y te cobra por contártelo.', 90],
  ['Líder Alfa', 'COACHING', 'Habla de disciplina en un vídeo grabado a las 12 del mediodía.', 35],
  ['Vendedor de Sueños', 'OTROS', 'Vende lo que sea, siempre que lo llames oportunidad única.', 22],
  ['Curso Definitivo', 'OTROS', 'El último curso que necesitarás, hasta que saque el siguiente.', 15],
  ['Secreto Revelado', 'OTROS', 'El secreto que "ellos" no quieren que sepas, en PDF de 8 páginas.', 30],
]

const reiniciar_datos = () => {
  const insert = db.prepare(
    'INSERT INTO vendehumos (nombre, url_foto, categoria, descripcion, numero_votos) VALUES (?, ?, ?, ?, ?)'
  )

  db.exec('BEGIN')
  try {
    db.exec('DELETE FROM vendehumos')
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'vendehumos'")
    DATOS.forEach(([nombre, categoria, descripcion, votos], i) => {
      const url_foto = `https://picsum.photos/seed/vendehumo${i + 1}/300/300`
      insert.run(nombre, url_foto, categoria, descripcion, votos)
    })
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

reiniciar_datos()
console.log(`BBDD reiniciada con ${DATOS.length} vendehumos.`)
