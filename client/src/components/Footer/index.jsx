import React from 'react';

function Footer() {
    return (
      <>
      <br></br><br></br><br></br>
        <footer className="bg-white rounded-lg dark:bg-gray-900 m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center mb-4 sm:mb-0">
                        <img src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58" className="h-8 mr-3" alt="Audify.me Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Audify.me</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="/about" className="mr-4 hover:underline md:mr-6">About</a>
                        </li>
                        <li>
                            <a href="https://github.com/elliotclowes/json-derulo/" className="mr-4 hover:underline md:mr-6">GitHub</a>
                        </li>
                        <li>
                            <a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="/" className="hover:underline">Audify.me™</a>. All Rights Reserved.</span>
            </div>
        </footer>
        </>
    );
}

export default Footer;
