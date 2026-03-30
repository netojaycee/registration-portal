"use client";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutUserAction } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import * as XLSX from "xlsx";
import { getUserColumns, UserRow } from "./user-table-columns";
import { Input } from "@/components/ui/input";
import {
  fetchUsersAction,
  bulkAccreditUsersAction,
  accreditUserAction,
} from "@/lib/actions/accreditation.action";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  function handleLogout() {
    window.location.href = "/logout";
  }
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [accredited, setAccredited] = useState(0);
  const [unaccredited, setUnaccredited] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isAccredited: undefined as boolean | undefined,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, [filters]);

  async function loadUsers() {
    startTransition(async () => {
      const res = await fetchUsersAction({ ...filters });
      if (res && (res as any)?.success) {
        setUsers((res as any)?.users);
        setTotal((res as any)?.total);
        setAccredited(
          (res as any)?.users.filter((u: any) => u.isAccredited).length,
        );
        setUnaccredited(
          (res as any)?.users.filter((u: any) => !u.isAccredited).length,
        );

        console.log("Loaded users:", (res as any)?.users);
      } else {
        toast.error((res as any)?.error || "Failed to fetch users");
      }
    });
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected(users.map((u: any) => u.id));
    } else {
      setSelected([]);
    }
  }

  function handleSelect(id: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id),
    );
  }

  async function handleBulkAccredit() {
    if (!selected.length) return;
    startTransition(async () => {
      const res = await bulkAccreditUsersAction({ ids: selected });
      if (res && (res as any)?.success) {
        let msg = `Accredited ${(res as any)?.updatedCount} user(s).`;
        if ((res as any)?.already && (res as any)?.already.length > 0) {
          msg += ` ${(res as any)?.already.length} already accredited.`;
        }
        toast.success(msg);
        setSelected([]);
        loadUsers();
      } else if (res && (res as any)?.alreadyAccredited) {
        toast.info(`All selected users are already accredited.`);
      } else {
        toast.error((res as any)?.error || "Bulk accredit failed");
      }
    });
  }

  const [exportType, setExportType] = useState<
    "all" | "accredited" | "unaccredited"
  >("all");

  function handleExportExcel() {
  let exportUsers = users;
  if (exportType === "accredited") {
    exportUsers = users.filter((u: any) => u.isAccredited);
  } else if (exportType === "unaccredited") {
    exportUsers = users.filter((u: any) => !u.isAccredited);
  }
  if (!exportUsers.length) {
    toast.info("No users to export for this selection.");
    return;
  }
  const exportData = exportUsers.map((u: any) => ({
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    email: u.email || "",
    username: u.username || "",
    phoneNumber: u.phoneNumber || "",
    gender: u.gender || "",
    maritalStatus: u.maritalStatus || "",
    membershipStatus: u.membershipStatus || "",
    modeOfAttendance: u.modeOfAttendance || "",
    area: u.area || "",
    branch: u.branch || "",
    cluster: u.cluster || "",
    accommodation: u.accommodation || "",
    educationCareer: u.educationCareer || "",
    classLevel: u.classLevel || "",
    classDivision: u.classDivision || "",
    faculty: u.faculty || "",
    job: u.job || "",
    address: u.address || "",
    Accredited: u.isAccredited ? "Yes" : "No",
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  let filename = "users";
  if (exportType === "accredited") filename = "accredited-users";
  if (exportType === "unaccredited") filename = "unaccredited-users";
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

  return (
    <div className="max-w-7xl mx-auto">
      {/* <div className="flex justify-end mb-6">
        <Button onClick={handleLogout} variant="destructive" size="sm">
          Logout
        </Button>
      </div> */}
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accredited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {accredited}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unaccredited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {unaccredited}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <Input
          placeholder="First Name"
          value={filters.firstName}
          onChange={(e) =>
            setFilters((f) => ({ ...f, firstName: e.target.value }))
          }
          className="w-40"
        />
        <Input
          placeholder="Last Name"
          value={filters.lastName}
          onChange={(e) =>
            setFilters((f) => ({ ...f, lastName: e.target.value }))
          }
          className="w-40"
        />
        <Input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
          className="w-56"
        />
        <select
          value={
            filters.isAccredited === undefined
              ? "all"
              : filters.isAccredited
              ? "1"
              : "0"
          }
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              isAccredited:
                e.target.value === "all"
                  ? undefined
                  : e.target.value === "0"
                  ? false
                  : true,
            }))
          }
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="1">Accredited</option>
          <option value="0">Unaccredited</option>
        </select>
        <Button onClick={loadUsers} type="button" variant="outline" size="sm">
          Filter
        </Button>
      </div>

      {/* Bulk Actions & Export */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {selected.length > 0 && (
          <>
            <span className="font-medium">{selected.length} selected</span>
            <Button onClick={handleBulkAccredit} size="sm" variant="default">
              Bulk Accredit
            </Button>
          </>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Users</option>
            <option value="accredited">Only Accredited</option>
            <option value="unaccredited">Only Unaccredited</option>
          </select>
          <Button onClick={handleExportExcel} size="sm" variant="outline">
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={getUserColumns(
          selected,
          handleSelect,
          (checked) => {
            if (checked) setSelected(users.map((u: any) => u.id));
            else setSelected([]);
          },
          async (id: string) => {
            const res = await accreditUserAction({ id });
            if (res && (res as any)?.success) {
              toast.success("User accredited!");
              loadUsers();
            } else {
              toast.error((res as any)?.error || "Failed to accredit");
            }
          },
        )}
        data={users}
        selected={selected}
        onSelect={handleSelect}
        onSelectAll={(checked) => {
          if (checked) setSelected(users.map((u: any) => u.id));
          else setSelected([]);
        }}
        onAccredit={async (id: string) => {
          const res = await accreditUserAction({ id });
          if (res && (res as any)?.success) {
            toast.success("User accredited!");
            loadUsers();
          } else if (res && (res as any)?.alreadyAccredited) {
            toast.info("User is already accredited.");
          } else {
            toast.error((res as any)?.error || "Failed to accredit");
          }
        }}
      />
    </div>
  );
}
