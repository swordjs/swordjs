import { Image } from 'image'
import * as std from 'std'
import { TensorflowSession } from 'tensorflow'

const img = new Image('bird.png')
const img_rgb = img.to_rgb().resize(224, 224)
const rgb_pix = img_rgb.pixels_32f()

const session = new TensorflowSession('mobilenet_v2_1.4_224_frozen.pb')
session.add_input_32f('input', rgb_pix, [1, 224, 224, 3])
session.add_output('MobilenetV2/Predictions/Softmax')
session.run()
const output = session.get_output('MobilenetV2/Predictions/Softmax')
const output_view = new Float32Array(output)
let max = 0
let max_idx = 0
for (var i in output_view) {
  const v = output_view[i]
  if (v > max) {
    max = v
    max_idx = i
  }
}
const label_file = std.open('imagenet_slim_labels.txt', 'r')
let label = ''
for (var i = 0; i <= max_idx; i++)
  label = label_file.getline()

label_file.close()

print('label:')
print(label)
print('confidence:')
print(max)
