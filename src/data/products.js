const products = [
  {
    id: 1,
    name: "HP Chromebook 11 G8 EE",
    price: 249.99,
    description: "The HP Chromebook 11 G8 EE is designed for education and built to last. With a durable design, spill-resistant keyboard, and long battery life, it's perfect for students and professionals alike. Featuring an 11.6-inch display, Intel Celeron processor, and Chrome OS for fast, secure computing.",
    specs: [
      "11.6-inch HD display (1366 x 768)",
      "Intel Celeron N4020 processor",
      "4GB RAM",
      "32GB eMMC storage",
      "Chrome OS",
      "Up to 13 hours battery life",
      "Spill-resistant keyboard",
      "Military-grade durability",
      "2 USB-C ports, 2 USB-A ports",
      "HD webcam"
    ],
    image: "/images/G8/front-view.jpeg",
    images: [
      "/images/G8/multi-image.jpeg",
      "/images/G8/top-view.png",
      "/images/G8/back-view.jpeg"
    ],
    stock: 15,
    featured: true
  },
  {
    id: 2,
    name: "HP Chromebook 14 G6",
    price: 299.99,
    description: "The HP Chromebook 14 G6 offers a larger display in a slim, portable design. Perfect for productivity and entertainment with its 14-inch screen, reliable performance, and all-day battery life. Enjoy the simplicity and security of Chrome OS with access to thousands of apps in the Google Play Store.",
    specs: [
      "14-inch HD display (1366 x 768)",
      "Intel Celeron N4120 processor",
      "4GB RAM",
      "64GB eMMC storage",
      "Chrome OS",
      "Up to 12 hours battery life",
      "Spill-resistant keyboard",
      "2 USB-C ports, 2 USB-A ports",
      "HD webcam with privacy shutter",
      "Stereo speakers"
    ],
    image: "/images/chromebook-14-g6.jpg",
    images: [
      "/images/chromebook-14-g6-1.jpg",
      "/images/chromebook-14-g6-2.jpg",
      "/images/chromebook-14-g6-3.jpg"
    ],
    stock: 10,
    featured: true
  },
  {
    id: 3,
    name: "HP Chromebook x360 11 G3 EE",
    price: 349.99,
    description: "The HP Chromebook x360 11 G3 EE is a versatile 2-in-1 convertible laptop designed for education. With its 360-degree hinge, you can use it as a laptop, tablet, or in tent mode. The touchscreen display and included stylus make it perfect for note-taking, drawing, and interactive learning.",
    specs: [
      "11.6-inch HD touchscreen display (1366 x 768)",
      "Intel Celeron N4100 processor",
      "8GB RAM",
      "64GB eMMC storage",
      "Chrome OS",
      "Up to 11.5 hours battery life",
      "360-degree hinge",
      "Spill-resistant keyboard",
      "Military-grade durability",
      "USI stylus support"
    ],
    image: "/images/chromebook-x360-11-g3.jpg",
    images: [
      "/images/chromebook-x360-11-g3-1.jpg",
      "/images/chromebook-x360-11-g3-2.jpg",
      "/images/chromebook-x360-11-g3-3.jpg"
    ],
    stock: 8,
    featured: false
  },
  {
    id: 4,
    name: "HP Chromebook 11a G8 EE",
    price: 229.99,
    description: "The HP Chromebook 11a G8 EE offers reliable performance at an affordable price. Built with education in mind, it features a durable design, long battery life, and the simplicity of Chrome OS. Perfect for students and budget-conscious users who need a reliable laptop for everyday tasks.",
    specs: [
      "11.6-inch HD display (1366 x 768)",
      "MediaTek MT8183 processor",
      "4GB RAM",
      "32GB eMMC storage",
      "Chrome OS",
      "Up to 15 hours battery life",
      "Spill-resistant keyboard",
      "Military-grade durability",
      "USB-C and USB-A ports",
      "HD webcam"
    ],
    image: "/images/chromebook-11a-g8.jpg",
    images: [
      "/images/chromebook-11a-g8-1.jpg",
      "/images/chromebook-11a-g8-2.jpg",
      "/images/chromebook-11a-g8-3.jpg"
    ],
    stock: 20,
    featured: false
  },
  {
    id: 5,
    name: "HP Chromebook 14a G5",
    price: 279.99,
    description: "The HP Chromebook 14a G5 combines performance and portability with a 14-inch display. Ideal for productivity and entertainment, it features a comfortable keyboard, good battery life, and the security of Chrome OS. Perfect for students, professionals, and anyone who needs a reliable laptop for everyday use.",
    specs: [
      "14-inch HD display (1366 x 768)",
      "AMD A4-9120C processor",
      "4GB RAM",
      "32GB eMMC storage",
      "Chrome OS",
      "Up to 10 hours battery life",
      "Full-size keyboard",
      "2 USB-C ports, 2 USB-A ports",
      "HD webcam",
      "Dual speakers"
    ],
    image: "/images/chromebook-14a-g5.jpg",
    images: [
      "/images/chromebook-14a-g5-1.jpg",
      "/images/chromebook-14a-g5-2.jpg",
      "/images/chromebook-14a-g5-3.jpg"
    ],
    stock: 12,
    featured: false
  },
  {
    id: 6,
    name: "HP Chromebook 11 G9 EE",
    price: 299.99,
    description: "The latest HP Chromebook 11 G9 EE features improved performance and durability for education environments. With its updated processor, enhanced security features, and long battery life, it's designed to withstand the rigors of daily use in classrooms and beyond.",
    specs: [
      "11.6-inch HD display (1366 x 768)",
      "Intel Celeron N5100 processor",
      "8GB RAM",
      "64GB eMMC storage",
      "Chrome OS",
      "Up to 14 hours battery life",
      "Spill-resistant keyboard",
      "Military-grade durability",
      "USB-C and USB-A ports",
      "HD webcam with privacy cover"
    ],
    image: "/images/chromebook-11-g9.jpg",
    images: [
      "/images/chromebook-11-g9-1.jpg",
      "/images/chromebook-11-g9-2.jpg",
      "/images/chromebook-11-g9-3.jpg"
    ],
    stock: 5,
    featured: true
  }
];

export default products;