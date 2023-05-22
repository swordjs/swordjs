import { Image } from 'image'

const img = new Image(`${__dirname}/bird.png`)
const img_luma = img.to_luma()
img_luma.save_to_file(`${__dirname}/bird_luma.png`)
