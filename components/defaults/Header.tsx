import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function DefaultEventTopHeader() {
  return (
    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <div className="relative flex flex-1">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div>
                <a
                  href="/dashboard/events"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <HomeIcon
                    className="h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>

            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <p
                  className="ml-4 text-sm font-medium text-gray-700"
                  aria-current="page"
                >
                  Event
                </p>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
