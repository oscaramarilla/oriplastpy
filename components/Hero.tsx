"use client"

import { useState } from "react"

export default function Hero() {

  const slides = [
    {
      title: "Linha Escolar",
      badge: "Linha Escolar - Oriplast",
      images: [
        "/images/escolar1.png",
        "/images/escolar2.png",
        "/images/escolar3.png"
      ]
    },
    {
      title: "Linea Pratice",
      badge: "Linea Pratice - Oriplast",
      images: [
        "/images/pratice1.png",
        "/images/pratice2.png",
        "/images/pratice3.png"
      ]
    },
    {
      title: "Linea Oriplast",
      badge: "Linea Oriplast - Oriplast",
      images: [
        "/images/oriplast1.png",
        "/images/oriplast2.png",
        "/images/oriplast3.png"
      ]
    }
  ]

  const [current, setCurrent] = useState(0)

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[current]

  return (
    <section className="relative bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">

      {/* LEFT ARROW */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition z-10"
      >
        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2">
          <path d="M17 6 L9 14 L17 22" />
        </svg>
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition z-10"
      >
        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2">
          <path d="M11 6 L19 14 L11 22" />
        </svg>
      </button>

      <div className="max-w-7xl mx-auto px-20 lg:px-28 py-24 grid md:grid-cols-2 gap-12 items-center">

        <div>

          <span className="bg-white text-green-600 px-3 py-1 rounded text-sm">
            {slide.badge}
          </span>

          <h1 className="text-5xl font-bold mt-6">
            {slide.title}
          </h1>

          <p className="mt-4 text-lg opacity-90">
            Mesas e cadeiras escolares com design moderno,
            durabilidade e qualidade garantida.
          </p>

          <button className="mt-8 bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
            Ver Produtos
          </button>

        </div>

        {/* Images */}
        <div className="flex gap-6 justify-center">

          {slide.images.map((img, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-xl hover:-translate-y-3 transition"
            >
              <img src={img} className="w-36" />
            </div>
          ))}

        </div>

      </div>

    </section>
  )
}