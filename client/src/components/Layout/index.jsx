import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  PlusCircleIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  DocumentArrowUpIcon,
  HomeIcon,
  VideoCameraIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Dashboard', href: '/dash', icon: HomeIcon, current: false },
  { name: 'Classes', href: '#', icon: UsersIcon, current: false },
  { name: 'Recorded Summaries', href: '/summaries', icon: DocumentDuplicateIcon, current: false },
  { name: 'Uploaded Summaries', href: '/summaries/audio', icon: DocumentArrowUpIcon, current: false },
  { name: 'Video Summaries', href: '/summaries/video', icon: VideoCameraIcon, current: false },
]
const teams = [
  { id: 1, name: 'History', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Geography', href: '#', initial: 'G', current: false },
  { id: 3, name: 'Physics', href: '#', initial: 'P', current: false },
  { id: 4, name: 'Maths', href: '#', initial: 'M', current: false },
]
const newClasses = [
  { id: 1, name: 'Record Live', href: '/summary', initial: '+', current: false },
  { id: 2, name: 'Upload Audio', href: '/audio', initial: '+', current: false },
  { id: 3, name: 'Summarise Video', href: '/video', initial: '+', current: false },
]
const userNavigation = [
  { name: 'Settings', href: '/settings' },
  { name: 'Sign out', href: '/signout' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  const [username, setUsername] = useState(""); // For the user's name
  const [userImage, setUserImage] = useState(""); // For the user's image URL

  useEffect(() => {
    const firstname = localStorage.getItem('firstname');
    const imageUrl = localStorage.getItem('imageUrl');

    if (firstname) setUsername(firstname);
    if (imageUrl) setUserImage(imageUrl);

  }, []);

  // Function to handle the input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle the form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to the appropriate URL based on the search query
    window.location.href = `/search/${searchQuery}`;
  };

  // test
  return (
    <>
    <div
    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
    aria-hidden="true"
>
    <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
            clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
    />
</div>

      <div data-testid="layout-component">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <a href="/"><img
                        className="h-8 w-auto"
                        src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58" alt="Audify.me"
                      /></a>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <br></br>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Your Classes</div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a data-testid="link-component"
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                          <div className="text-xs font-semibold leading-6 text-gray-400">Start A New Summary</div>
<ul role="list" className="-mx-2 mt-2 space-y-1">
  {newClasses.map((newClass) => (
    <li key={newClass.name}>
      <a
        href={newClass.href}
        className={classNames(
          newClass.current
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
          {newClass.initial}
        </span>
        <span className="truncate">{newClass.name}</span>
      </a>
    </li>
  ))}
</ul>
                        </li>
                        <li className="mt-auto">
                          <a
                            href="/settings"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Settings
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
            <a href="/"><img
                className="h-8 w-auto"
                src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Flogo.svg?alt=media&token=1b976e10-5cf3-42e0-827a-136ced55ba58" alt="Audify.me"
              /></a>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                
                  <div className="text-xs font-semibold leading-6 text-gray-400">Start A New Summary</div>
<ul role="list" className="-mx-2 mt-2 space-y-1">
  {newClasses.map((newClass) => (
    <li key={newClass.name}>
      <a
        href={newClass.href}
        className={classNames(
          newClass.current
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
          {newClass.initial}
        </span>
        <span className="truncate">{newClass.name}</span>
      </a>
    </li>
  ))}
</ul>
<br></br>
<div className="text-xs font-semibold leading-6 text-gray-400">Your Classes</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="/settings"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form
          className="relative flex flex-1"
          onSubmit={handleSearchSubmit} // Handle form submission
        >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
            value={searchQuery} // Set the value from state
            onChange={handleSearchChange} // Handle input change
          />
        </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">



                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                                <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src={userImage || "https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Fwhite-avatar.jpg?alt=media&token=d5ae6e0e-7848-4b33-be13-4ea6dc19159d"}
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {username || "No user logged in!"}
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Content from each page/component */}
              {children}
            </div>
          </main>

        </div>
      </div>
    </>
  )
}
