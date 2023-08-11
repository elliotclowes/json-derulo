import { SignupForm } from "../../components";

export default function Signup() {
  return (
    <>
      <div className="signup-wrapper">
        <div className="container main">
          <div className="row signup">
            <div className="col-md-6 side-image">
              <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg" alt="" width="420px"/>
            </div>
            <div className="col-md-6 right">
              <div className="small-logo">
                <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg" alt="" />
              </div>
              <div className="input-box">
                <header>Create An Account</header>
                <SignupForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
