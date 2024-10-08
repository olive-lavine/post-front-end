export default function Footer() {
  return (
    <footer className="pb-4 pt-4">
      <div className="max-w-6xl xl:max-w-6xl mx-auto divide-y divide-gray-200 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse justify-between pt-5 pb-4 border-t lg:flex-row bg-top dark:border-white">
          <ul className="flex flex-col space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <li>
              <a
                href="/"
                className="text-mdtransition-colors duration-300 hover:text-purple-950 font-semibold"
              >
                Terms of Service
              </a>
            </li>

            <li>
              <a
                href="/"
                className="text-md transition-colors duration-300 hover:text-purple-950 font-semibold"
              >
                Partners
              </a>
            </li>
          </ul>
          <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <a
              href="/"
              className="text-md transition-colors duration-300 hover:text-purple-950 font-semibold tracking-tight"
            >
              © 2024 POST Dataset
            </a>
          </ul>
        </div>
      </div>
    </footer>
  );
}
