import Link from "next/link";
import { Map } from "./components/Map";
import { fetchMapData } from "../lib/fetchMapData";

const availableStates: Record<string, string> = {
  Arizona: "AZ",
  California: "CA",
  Florida: "FL",
  Georgia: "GA",
  Illinois: "IL",
  Maryland: "MD",
  Ohio: "OH",
  Oregon: "OR",
  "South Carolina": "SC",
  Tennessee: "TN",
  Texas: "TX",
  Vermont: "VT",
  Washington: "WA",
};

export default async function Home() {
  const data = await fetchMapData();

  return (
    <main className="relative p-0 m-0">
      <section className="mx-auto flex px-5 md:flex-row flex-col items-center">
        <div className="flex-grow w-full max-w-7xl">
          <Map data={data} availableStates={availableStates} />
        </div>
        <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="mb-5 sm:text-xl text-2xl items-center xl:w-2/2 ">
            Peace Officer Standards and Training Data
          </h1>
          <p className="mb-4 xl:w-3/4  text-md text-left">
            The data presented here was obtained through public records requests
            from Peace Officer Standards and Training (POST) datasets across 13
            states. The data contains information on police officer employment
            history, including officer name, department, and employment dates.
          </p>
        </div>
      </section>
      <section className="mx-auto">
        <div className="container px-5 mx-auto lg:px-24 ">
          <div className="flex flex-col w-full mb-4 text-left lg:text-center">
            {/* <h1 className="mb-8 text-xl font-semibold ">
              View data from any of the following states:
            </h1> */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(availableStates).map(([state, abbreviation]) => (
              <Link key={state} href={`/${abbreviation}/info`} text-lg>
                <button className="w-40 h-full rounded-md border hover:bg-gray-100  border-gray-800 dark:bg-slate-600 dark:hover:bg-slate-800 dark:hover:border-gray-600">
                  {state}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
