import React from 'react';

const TestPage = () => (
  <>
  
  <button className="btn">
  <span className="loading loading-spinner"></span>
  loading
</button>
  <div className="avatar-group -space-x-6">
  <div className="avatar">
    <div className="w-12">
      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div className="avatar">
    <div className="w-12">
      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div className="avatar">
    <div className="w-12">
      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div className="avatar placeholder">
    <div className="w-12 bg-neutral-focus text-neutral-content">
      <span>+99</span>
    </div>
  </div>
</div>
    <div className="alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <span>Warning: Invalid email address!</span>
    </div>

    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold">Tailwind CSS and DaisyUI Test Page</h1>

    {/* DaisyUI Button */}
    <button className="btn btn-primary">Primary Button</button>

    {/* Tailwind CSS Card */}
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">A Card Component</h2>
      <p className="text-gray-700">This card is styled using Tailwind CSS.</p>
    </div>

    {/* DaisyUI Toggle */}
    <div className="toggle">
      <input type="checkbox" id="toggle-1" />
      <label htmlFor="toggle-1">Toggle me</label>
    </div>

    {/* DaisyUI Progress Bar */}
    <div className="progress progress-primary">
      <div className="progress-bar w-1/2"></div>
    </div>

    {/* Tailwind CSS Flex Container */}
    <div className="flex space-x-4">
      <div className="flex-1 p-4 border rounded-lg">
        Flex Item 1
      </div>
      <div className="flex-1 p-4 border rounded-lg">
        Flex Item 2
      </div>
    </div>

    {/* DaisyUI Dropdown */}
    <details className="dropdown">
      <summary className="btn">Dropdown</summary>
      <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </details>

    {/* Tailwind CSS Grid */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-200 p-4 rounded">Column 1</div>
      <div className="bg-gray-300 p-4 rounded">Column 2</div>
      <div className="bg-gray-400 p-4 rounded">Column 3</div>
    </div>
  </div>

  </>
);

export default TestPage;
