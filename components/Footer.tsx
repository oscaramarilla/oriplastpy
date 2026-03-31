"use client"

import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export default function Footer() {

  return (

<footer className="bg-gray-900 text-gray-300">

<div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">


{/* LINKS */}

<div>

<h3 className="text-white font-semibold text-lg mb-5">
Links
</h3>

<ul className="space-y-3">

<li className="hover:text-green-500 cursor-pointer transition">
Principal
</li>

<li className="hover:text-green-500 cursor-pointer transition">
A Empresa
</li>

<li className="hover:text-green-500 cursor-pointer transition">
Produtos
</li>

</ul>

</div>


{/* ADDRESS */}

<div>

<h3 className="text-white font-semibold text-lg mb-5">
Endereço
</h3>

<div className="flex items-start gap-3">

<FaMapMarkerAlt className="text-green-500 text-xl mt-1"/>

<div>

<p>Rod PR 364, Km 580, nº 1378</p>
<p>Palotina - PR</p>
<p>CEP 85950-000</p>

<a
href="https://maps.google.com"
className="text-green-500 hover:underline mt-2 inline-block"
>
Ver no mapa
</a>

</div>

</div>

</div>


{/* CONTACT */}

<div>

<h3 className="text-white font-semibold text-lg mb-5">
Contato
</h3>

<p>(44) 3649-5995</p>
<p>(44) 99717-2196</p>

<div className="flex items-center gap-2 mt-2">

<MdEmail className="text-green-500"/>

<p>vendas@oriplast.ind.br</p>

</div>


{/* SOCIAL ICONS */}

<div className="flex gap-4 mt-6">

<a className="bg-gray-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition">

<FaFacebook/>

</a>

<a className="bg-gray-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition">

<FaInstagram/>

</a>

<a className="bg-gray-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition">

<FaWhatsapp/>

</a>

<a className="bg-gray-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition">

<MdEmail/>

</a>

</div>

</div>

</div>


{/* BOTTOM */}

<div className="border-t border-gray-700 text-center py-6 text-sm">

© 2026 Oriplast Plásticos Injetados

</div>

</footer>

  )

}