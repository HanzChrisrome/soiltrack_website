import React from "react";
import { ChevronsUpDown } from "lucide-react"; // You need to install lucide-react
import CardContainer from "../../widgets/CardContainer";
import { useReadingStore } from "../../../store/mun_admin/useReadingStore";

const PatientTable = () => {
  const { userSummary } = useReadingStore();

  return (
    <CardContainer className="overflow-x-auto rounded-lg mt-2">
      <table className="table w-full bg-base-100">
        <thead className="text-neutral text-sm bg-base-300">
          <tr>
            <th>
              <div className="flex items-center gap-1">
                User Name
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                User Barangay
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                User Plot Count
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </th>
            <th>
              <div className="flex items-center gap-1">
                User IOT Mac Address
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {(userSummary ?? []).map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_name}</td>
              <td>{u.user_barangay}</td>
              <td>{u.plot_count}</td>
              <td>{u.mac_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContainer>
  );
};

export default PatientTable;
