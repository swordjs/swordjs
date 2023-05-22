import * as fs from 'node:fs'
import { Image } from 'image'
import { NnContext, NnGraph, TENSOR_TYPE_U8 } from 'wasi_nn'

const img = new Image(`${__dirname}/food.jpg`)
const img_rgb = img.to_rgb().resize(192, 192)
const rgb_pix = img_rgb.pixels()

const data = fs.readFileSync(`${__dirname}/lite-model_aiy_vision_classifier_food_V1_1.tflite`)
const graph = new NnGraph([data.buffer], 'tensorflowlite', 'cpu')
const context = new NnContext(graph)
context.setInput(0, rgb_pix, [1, 192, 192, 3], TENSOR_TYPE_U8)
context.compute()

const output_view = new Uint8Array(2024)
context.getOutput(0, output_view.buffer)

let max = 0
let max_idx = 0
for (const i in output_view) {
  const v = output_view[i]
  if (v > max) {
    max = v
    max_idx = i
  }
}

const label_file = fs.readFileSync(`${__dirname}/aiy_food_V1_labelmap.txt`, 'utf-8')
const lables = label_file.split(/\r?\n/)

const label = lables[max_idx]

print('label:')
print(label)
print('confidence:')
print(max / 255)
