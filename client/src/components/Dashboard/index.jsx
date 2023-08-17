import { EllipsisVerticalIcon, ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

const statuses = {
  Live: 'text-green-700 bg-green-50 ring-green-600/20',
  'Video': 'text-indigo-600 bg-indigo-50 ring-indigo-500/10',
  Audio: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}


const summaries = [
  {
    id: 1,
    name: 'GraphQL API',
    href: '#',
    status: 'Live',
    dueDate: 'March 17, 2023',
    dueDateTime: '2023-03-17T00:00Z',
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'Audio',
    dueDate: 'May 5, 2023',
    dueDateTime: '2023-05-05T00:00Z',
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'Video',
    dueDate: 'May 25, 2023',
    dueDateTime: '2023-05-25T00:00Z',
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'Video',
    dueDate: 'June 7, 2023',
    dueDateTime: '2023-06-07T00:00Z',
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Audio',
    dueDate: 'June 10, 2023',
    dueDateTime: '2023-06-10T00:00Z',
  },
]



const projects = [
    { name: 'History', initials: 'H', href: '#', summaries: 9, bgColor: 'bg-pink-600' },
    { name: 'Geography', initials: 'G', href: '#', summaries: 13, bgColor: 'bg-purple-600' },
    { name: 'Physics', initials: 'P', href: '#', summaries: 4, bgColor: 'bg-yellow-500' },
    { name: 'Maths', initials: 'M', href: '#', summaries: 7, bgColor: 'bg-indigo-500' },
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const stats = [
    { name: 'Words transcribed', stat: '54,897' },
    { name: 'Audio recorded', stat: '13 hours' },
    { name: 'Summaries made', stat: '17' },
  ]
  
  export default function Dashboard() {
    return (
        <>
      <div>
        <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-4">




                <div>
            <h2 className="text-lg font-semibold leading-6 text-gray-900">Your Classes</h2>
            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {projects.map((project) => (
                <li key={project.name} className="col-span-1 flex rounded-md shadow-sm">
                    <div
                    className={classNames(
                        project.bgColor,
                        'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                    )}
                    >
                    {project.initials}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                        <a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">
                        {project.name}
                        </a>
                        <p className="text-gray-500">{project.summaries} summaries</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                        <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            </div>

            <br></br>
            <br></br>
            <hr></hr>
            <br></br>



            <h3 className="text-lg font-semibold leading-6 text-gray-900">Last 30 Days</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
                <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                </div>
            ))}
            </dl>


            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
            <br></br>


            <div className="relative">

<div
className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
aria-hidden="true"
>
<div
    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
    style={{
        clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
    }}
/>
</div>
</div>
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Recent summaries</h3>
            <br></br>
            <ul role="list" className="bg-white divide-y divide-gray-100 rounded-lg shadow p-6">

  {summaries.map((project) => (
        <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">{project.name}</p>
              <p
                className={classNames(
                  statuses[project.status],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {project.status}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                <time dateTime={project.dueDateTime}>{project.dueDate}</time>
              </p>
   
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <a
              href={project.href}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
              View Summary<span className="sr-only">, {project.name}</span>
            </a>
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit<span className="sr-only">, {project.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Move<span className="sr-only">, {project.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Delete<span className="sr-only">, {project.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>


        </div>
      </div>
      
      </>
    )
  }
  