import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Bell,
  Key,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useMembersData } from "../../hooks/useMembersData";

const MembersSection = () => {
  const { members, addMember, updateMember, deleteMember, changePassword } =
    useMembersData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    department: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const handleAction = (action, member = null) => {
    if (action === "add" || action === "edit") {
      setEditingMember(member);
      setFormData(
        member || {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          position: "",
          department: "",
        }
      );
      setIsModalOpen(true);
    } else if (
      action === "delete" &&
      window.confirm("คุณแน่ใจหรือไม่ที่จะลบสมาชิกนี้?")
    ) {
      deleteMember(member.id);
      addNotification(
        `ลบสมาชิก ${member.firstName} ${member.lastName} เรียบร้อยแล้ว`
      );
    } else if (action === "changePassword") {
      setEditingMember(member);
      setNewPassword("");
      setIsPasswordModalOpen(true);
    }
  };

  const handleSaveMember = () => {
    if (editingMember) {
      updateMember({ ...editingMember, ...formData });
      addNotification(
        `อัปเดตข้อมูลสมาชิก ${formData.firstName} ${formData.lastName} เรียบร้อยแล้ว`
      );
    } else {
      addMember(formData);
      addNotification(
        `เพิ่มสมาชิก ${formData.firstName} ${formData.lastName} เรียบร้อยแล้ว`
      );
    }
    setIsModalOpen(false);
  };

  const handleChangePassword = () => {
    changePassword(editingMember.id, newPassword);
    addNotification(
      `เปลี่ยนรหัสผ่านของ ${editingMember.firstName} ${editingMember.lastName} เรียบร้อยแล้ว`
    );
    setIsPasswordModalOpen(false);
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    toast.success(message);
  };

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">จัดการสมาชิก</CardTitle>
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleAction("add")} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> เพิ่มสมาชิก
          </Button>
          <div className="relative">
            <Bell
              className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setNotifications([])}
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="ค้นหาสมาชิก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>นามสกุล</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>ตำแหน่ง</TableHead>
              <TableHead>แผนก</TableHead>
              <TableHead>การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAction("edit", member)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("changePassword", member)}
                      >
                        <Key className="mr-2 h-4 w-4" /> เปลี่ยนรหัสผ่าน
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("delete", member)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              "firstName",
              "lastName",
              "email",
              "password",
              "position",
              "department",
            ].map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right">
                  {field === "firstName"
                    ? "ชื่อ"
                    : field === "lastName"
                    ? "นามสกุล"
                    : field === "email"
                    ? "Email"
                    : field === "password"
                    ? "รหัสผ่าน"
                    : field === "position"
                    ? "ตำแหน่ง"
                    : "แผนก"}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : "text"}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveMember}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                รหัสผ่านใหม่
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleChangePassword}>
              บันทึกรหัสผ่านใหม่
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MembersSection;
