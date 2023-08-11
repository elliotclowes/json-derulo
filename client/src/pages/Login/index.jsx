import image from "../../assets/logo.png";
import { LoginForm } from "../../components";

export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-cover" style={{ backgroundImage: `url("https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg")` }}>
        <img src={image} alt="logo" className="w-56 mx-auto mt-10" />
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <div className="mb-8">
          <img src={image} alt="logo" className="w-20 h-20 mx-auto" />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Learnt.me</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
