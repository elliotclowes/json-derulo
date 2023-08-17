import { MicrophoneIcon, DocumentTextIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Just hit record.',
    description:
      "In close to real-time we transcribe what is being said. We can even differentiate teacher from student, so only what's important is being transcribed.",
    icon: MicrophoneIcon,
  },
  {
    name: 'Get back a summary.',
    description: "We'll remove the superfluous and show you only what matters. AI will guide you and stick to what's necessary.",
    icon: DocumentTextIcon,
  },
  {
    name: 'Get more detail.',
    description: "You can expand or shorten summaries. Unsure on a concept? Just highlight it and click '?' and we'll tell you all you need to know.",
    icon: MagnifyingGlassCircleIcon,
  },
]

export default function Example() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Learn faster</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unleash the speech</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Audify.me takes speech, transcribes it and then uses AI to summarise it. It gets to the heart of what's being said with uncanny accuracy and is an unbeatable lecture hall aid.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/learnt-me-test.appspot.com/o/manual%2Fsite-min.jpeg?alt=media&token=1194656d-85ac-4bae-b0bb-63d6e2145683"
            alt="Site screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  )
}

