"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const StatePage = () => {
  const pathname = usePathname();
  console.log(pathname);
  return <div>a page!!</div>;
};

export default StatePage;
// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   getOfficersByAgency,
//   fetchOfficersData,
// } from "../../../data/officersData";
// import { PeaceOfficer, Agency } from "../../../data/officersData";
// import OfficerList from "../../components/OfficerList";
// import Pagination from "../../components/Pagination";
// import Link from "next/link";

// const StatePage = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [agency, setAgency] = useState("all");
//   const [sortBy, setSortBy] = useState("last-name");
//   const [officers, setOfficers] = useState<PeaceOfficer[]>([]);
//   const [agencies, setAgencies] = useState<Agency[]>([]);
//   const [stateCode, setStateCode] = useState<string>(
//     pathname.split("/")[2] || ""
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(15);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Sort-by dropdown options
//   const states = [
//     { value: "WA", label: "WA" },
//     { value: "VT", label: "VT" },
//   ];
//   const sortedStates = states.sort((a, b) => a.label.localeCompare(b.label));

//   const sortOptions = [
//     { value: "last-name", label: "Last Name" },
//     { value: "first-name", label: "First Name" },
//     { value: "uid", label: "UID" },
//   ];
//   const sortedSortOptions = sortOptions.sort((a, b) =>
//     a.label.localeCompare(b.label)
//   );

//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         if (stateCode) {
//           const agencyData = await fetchOfficersData(stateCode);
//           const sortedAgencies = agencyData.sort((a, b) =>
//             a.agencyName.localeCompare(b.agencyName)
//           );
//           setAgencies(sortedAgencies);
//         }
//       } catch (error) {
//         console.error("Failed to fetch agencies", error);
//       }
//     };

//     fetchAgencies();
//   }, [stateCode]);

//   const fetchOfficers = async (page: number, perPage: number) => {
//     try {
//       setLoading(true);
//       const { officers, totalItems } = await getOfficersByAgency(
//         stateCode,
//         agency,
//         page,
//         perPage,
//         sortBy,
//         "",
//         "",
//         "",
//         ""
//       );
//       setOfficers(officers);
//       setTotalItems(totalItems);
//     } catch (error) {
//       setError("Failed to fetch officers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOfficers(currentPage, itemsPerPage);
//   }, [stateCode, agency, sortBy, currentPage]);

//   useEffect(() => {
//     const pathState = pathname.split("/")[2];
//     if (pathState && pathState !== stateCode) {
//       setStateCode(pathState);
//       setAgency("all");
//       setSortBy("last-name");
//       setCurrentPage(1); // reset pagination
//     }
//   }, [pathname]);

//   const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const newStateCode = event.target.value;
//     setStateCode(newStateCode);
//     setCurrentPage(1);
//     router.push(
//       `/states/${newStateCode}?agency=${agency}&sortBy=${sortBy}&page=1`
//     );
//   };

//   const handleAgencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setAgency(event.target.value);
//     setCurrentPage(1);
//     router.push(
//       `/states/${stateCode}?agency=${event.target.value}&sortBy=${sortBy}&page=1`
//     );
//   };

//   const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortBy(event.target.value);
//     setCurrentPage(1);
//     router.push(
//       `/states/${stateCode}?agency=${agency}&sortBy=${event.target.value}&page=1`
//     );
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     router.push(
//       `/states/${stateCode}?agency=${agency}&sortBy=${sortBy}&page=${page}`
//     );
//   };

//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="text-center p-10">
//       <br/>
//       <div className="stats options-label">
//         <div>
//           <label className="options-label" htmlFor="state">
//             State:{" "}
//           </label>
//           <select
//             name="state"
//             id="state"
//             value={stateCode}
//             onChange={handleStateChange}
//             className="dropdown"
//           >
//             {sortedStates.map((state) => (
//               <option key={state.value} value={state.value}>
//                 {state.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="options-label" htmlFor="agency">
//             Agency:{" "}
//           </label>
//           <select
//             name="agency"
//             id="agency"
//             value={agency}
//             className="agency-select dropdown"
//             onChange={handleAgencyChange}
//           >
//             <option value="all">All</option>
//             {agencies.map((agencyItem) => (
//               <option key={agencyItem.id} value={agencyItem.agencyName}>
//                 {agencyItem.agencyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="options-label" htmlFor="sort-by">
//             Sort by:{" "}
//           </label>
//           <select
//             name="sort-by"
//             id="sort-by"
//             value={sortBy}
//             onChange={handleSortChange}
//             className="dropdown"
//           >
//             {sortedSortOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="cards">
//         <OfficerList officers={officers} />
//       </div>
//       <br/>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default StatePage;
