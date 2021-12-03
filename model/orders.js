const mongoose = require("mongoose");
const { Schema } = mongoose;
/*
ShippingInfo {},
user,
paymentInfo {},
taxAmount,
shippingAmmount,
totalAmmount,
orderStatus,
deliveredAt,
-------------------
OrdersItems: [{}]
- name,
- quantity,
- image[0]
- price,
- procuct
*/
/*
{
  "shippingInfo": {
    "address": "1 Jaipur",
    "city": "Jaipur",
    "phoneNo": "9898989898",
    "postalCode": "302020",
    "state": "Rajasthan",
    "country": "India"
  },
  "orderItems": [
    {
      "name": "Pro Coder tshirts",
      "quantity": 1,
      "image": "https://res.cloudinary.com/dk92l1yoc/image/upload/v1635757229/products/b4laryk4dbp6vdrvq3wv.png",
      "price": 999,
      "product": "617facb5333fd4c0fdfdee65"
    }
  ],
  "paymentInfo": {
    "id": "testString"
  },
  "taxAmount": 40,
  "shippingAmount": 10,
  "totalAmount": 100
}

*/

const orderSchema = new Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: "Product",
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "proccessing",
    required: true,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
