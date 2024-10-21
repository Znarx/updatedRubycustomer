import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";


export default function Home() {
  const router = useRouter(); // Initialize the router


  // Smooth scrolling function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Order delicious lechon and viands from Ruby Belly & Lechon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
  <div className="w-full max-w-1xl mx-auto flex items-center justify-between border-b-2 px-2 py-7 h-16 bg-black shadow-md">
  {/* Logo */}
  <div className="flex items-center">
    <Image
      src="/Vector.png"
      alt="Lechon Logo"
      width={40}
      height={35}
      priority
      className="object-contain"
    />
  </div>

  {/* Navigation Buttons - Adjusted Position */}
  <div className="flex-grow flex justify-end"> {/* Use justify-end for right alignment */}
    <div className="flex space-x-6 mx-6">
      <button
        onClick={() => scrollToSection("viands")}
        className="text-white font-bold hover:text-orange-500 transition"
      >
        Viands
      </button>
      <button
        onClick={() => scrollToSection("about")}
        className="text-white font-bold hover:text-orange-500 transition"
      >
        About Us
      </button>
    
    </div>
  </div>
</div>



      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('/belly.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">Ruby Belly & Lechon</h1>
          <button onClick={() => router.push("/login")} className="bg-red-600 text-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-red-500 transition">
            Order Now
          </button>
        </div>
      </div>

      {/* Viands Section */}
<div id="viands" className="bg-yellow-100 py-10">
  <div className="container mx-auto text-center mb-8">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Our Viands</h2>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
      Savor the taste of tradition and innovation with our handpicked viands, freshly prepared and perfect for any occasion.
    </p>
  </div>

  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
    {[
      {
        src: "https://chattrade.com/uploads/images/recipes/b281386e75160275fdbe614bc6c08ef7.jpg",
        name: "Lumpia",
      },
      {
        src: "https://img.freepik.com/premium-photo/rustic-fried-chicken-presentation_1179130-16613.jpg",
        name: "Fried Chicken",
      },
      {
        src: "https://recipes.net/wp-content/uploads/2023/12/how-to-cook-lechon-belly-in-oven-1701786912.jpg",
        name: "Lechon Belly",
      },
    ].map((item, idx) => (
      <div key={idx} className="relative group bg-white p-4 shadow-lg hover:shadow-xl transition overflow-hidden rounded-lg">
        <div className="w-full h-[300px] relative overflow-hidden">
          <Image
            src={item.src}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-white text-xl font-bold">{item.name}</p>
        </div>
      </div>
    ))}
  </div>
</div>

<div id="about" className="relative bg-[#FAF3E0] py-16"> {/* Example with Pastel Blue */}
  {/* Subtle background pattern */}
  <div className="absolute inset-0 bg-cover bg-no-repeat opacity-10" style={{ backgroundImage: "url('/bg-pattern.png')" }}></div>

  <div className="container mx-auto px-6 lg:px-12 text-center">
    {/* Title */}
    <h2 className="text-4xl font-extrabold text-gray-800 mb-4 animate__animated animate__zoomIn">
      About Us
    </h2>
    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate__animated animate__fadeInUp">
      Welcome to Ruby Belly & Lechon, your go-to place for delicious, crispy lechon and a wide variety of viands. We pride ourselves in offering the best Filipino delicacies made from fresh ingredients.
    </p>

    {/* Two-column layout: Text and Image */}
    <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
 {/* Text Section */}
{/* Text Section */}
<div className="lg:w-1/2 text-left space-y-6">
  <p className="text-lg text-gray-700 leading-relaxed transition-transform duration-300 hover:translate-x-2 hover:shadow-lg">
    Whether you’re hosting a family gathering or just craving for a savory treat, Ruby Belly & Lechon is here to serve you.
  </p>
  <p className="text-lg text-gray-700 leading-relaxed transition-transform duration-300 hover:translate-x-2 hover:shadow-lg">
    Founded in 2020, our business has been committed to quality, customer satisfaction, and authenticity. Every dish we prepare reflects our passion for Filipino cuisine, ensuring a taste of home in every bite.
  </p>
  
  {/* Contact Details Section */}
  <div className="text-lg text-gray-800 leading-relaxed mt-8">
    <h3 className="text-xl font-semibold text-gray-900">Get in Touch with Us!</h3>
    <p className="mt-2">We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out:</p>
    <ul className="list-disc list-inside mt-4 space-y-2">
      <li>
        <span className="font-semibold">✉️ Email:</span> 
        <a href="mailto:info@rubybelly.com" className="text-blue-600 hover:underline"> info@rubybelly.com</a>
      </li>
      <li>
        <span className="font-semibold">📞 Phone:</span> 
        <a href="tel:+1234567890" className="text-blue-600 hover:underline"> +1 234 567 890</a>
      </li>
      <li>
        <span className="font-semibold">🏠 Address:</span> 
        <span>1234 Lechon St, Foodie City, PH</span>
      </li>
    </ul>
  </div>
</div>



      {/* Image Section */}
      <div className="lg:w-1/2 mt-8 lg:mt-0">
        <Image
          src="https://queencitycebu.com/wp-content/uploads/2020/01/80581332_2809561425767284_7677262343771783168_o.jpg"
          alt="Delicious Lechon"
          width={500}
          height={300}
          className="rounded-lg shadow-lg object-cover transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
        />
      </div>
    </div>

  
  </div>
</div>



      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto flex justify-center space-x-8">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
          >
            <FaTwitter className="text-2xl text-gray-600 group-hover:text-white" />
            <span className="ml-2 text-gray-600 group-hover:text-white">Twitter</span>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
          >
            <FaFacebook className="text-2xl text-gray-600 group-hover:text-white" />
            <span className="ml-2 text-gray-600 group-hover:text-white">Facebook</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
          >
            <FaInstagram className="text-2xl text-gray-600 group-hover:text-white" />
            <span className="ml-2 text-gray-600 group-hover:text-white">Instagram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}