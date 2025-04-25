import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col p-6">
      <h1 className="text-4xl font-extrabold text-[#FF00FF]">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 text-[#FF00FF] hover:text-[#FF3bff]">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
