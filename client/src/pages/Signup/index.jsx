import { SignupForm } from "../../components";

export default function Signup() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="container mx-auto p-4 flex">
          <div className="w-1/2">
            <img
              src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg"
              alt=""
              className="w-full h-auto"
            />
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="mb-4">
              <img
                src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg"
                alt=""
                className="w-24 h-24"
              />
            </div>
            <div className="w-full max-w-md">
              <header className="text-2xl font-bold mb-4 text-center">Create An Account</header>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
