import React from 'react';

const BigButton = () => (
  <>
  <button className="btn btn-primary">Primary Button</button>
  <span className="badge">Badge</span>
  <details className="dropdown mb-32">
  <summary className="m-1 btn">open or close</summary>
  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</details>
  
  </>
);

export default BigButton;
