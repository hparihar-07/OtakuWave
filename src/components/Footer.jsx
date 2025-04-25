// src/components/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-black text-center py-4 border-t border-gray-800 text-sm text-white">
        <p>
          Made with <span className="text-red-500">♥</span> using{" "}
          <span className="text-blue-400 font-semibold">React</span>,{" "}
          <span className="text-teal-200 font-semibold">Tailwind CSS</span>, and
          <span className="text-yellow-300 font-semibold"> Supabase</span>.
          {" "}
          <br />
          by 
          <a
            href="https://hparihar07.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 font-bold hover:underline ml-1"
          >
            0xhparihar07
          </a>
        </p>
      </footer>
    );
  };
  
  export default Footer;
  