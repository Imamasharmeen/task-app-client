const Footer = () => {
  return (
    <footer className="bg-[#26204B] text-white py-12 text-center">
      <div className="container mx-auto">
        <p>
          &copy; {new Date().getFullYear()} Task . All Rights Reserved.
        </p>
        <div className="mt-2">
          <span className="text-gray-400">Privacy Policy</span>
          <span className="text-gray-400 mx-4">|</span>
          <span className="text-gray-400">Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
