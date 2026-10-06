import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";

const academicStats = [
  {
    label: "Overall marks",
    value: "518 / 600",
    detail: "Current semester",
    icon: Award,
  },
  {
    label: "Percentage",
    value: "86.3%",
    detail: "Semester average",
    icon: GraduationCap,
  },
  {
    label: "Attendance",
    value: "92%",
    detail: "Above 85% requirement",
    icon: CalendarDays,
  },
  {
    label: "CGPA",
    value: "8.7",
    detail: "Across 5 semesters",
    icon: BookOpen,
  },
];

const subjectMarks = [
  { subject: "Data Structures & Algorithms", code: "BCS501", marks: 91 },
  { subject: "Database Management Systems", code: "BCS502", marks: 88 },
  { subject: "Operating Systems", code: "BCS503", marks: 84 },
  { subject: "Computer Networks", code: "BCS504", marks: 86 },
  { subject: "Web Technologies", code: "BCS515B", marks: 82 },
];

const profileDetails = [
  { label: "Email", value: "aditya.ps@vvce.ac.in", icon: Mail },
  { label: "Student mobile", value: "+91 98765 43210", icon: Phone },
  { label: "Date of birth", value: "14 August 2003", icon: CalendarDays },
  { label: "Address", value: "Vijayanagar, Mysuru, Karnataka", icon: MapPin },
];

export function Profile() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setPasswordUpdated(false);
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordUpdated(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    setPasswordMessage("Password updated successfully.");
    setPasswordUpdated(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-3xl font-bold tracking-tight text-foreground">Student profile</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Personal information and academic performance at a glance.
            </p>
          </div>

          <Dialog
            open={isPasswordOpen}
            onOpenChange={(open) => {
              setIsPasswordOpen(open);
              if (!open) resetPasswordForm();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <KeyRound />
                Change password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handlePasswordSubmit}>
                <DialogHeader>
                  <DialogTitle>Change password</DialogTitle>
                  <DialogDescription>
                    Use at least 8 characters for your new portal password.
                  </DialogDescription>
                </DialogHeader>

                <div className="my-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>

                  {passwordMessage && (
                    <div
                      role="status"
                      className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
                        passwordUpdated
                          ? "border-foreground bg-primary text-primary-foreground"
                          : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {passwordUpdated ? <CheckCircle2 /> : <ShieldCheck />}
                      <span>{passwordMessage}</span>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPasswordOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update password</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardContent className="flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-20 border bg-primary">
                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                  AP
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-2xl font-bold text-foreground">Aditya PS</div>
                <p className="mt-1 text-muted-foreground">4VV22CS057</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                    Computer Science
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                    Semester 5
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                    Section A
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted p-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Active student</div>
                <p className="text-sm text-muted-foreground">Academic year 2025–26</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {academicStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="h-full">
                  <CardContent className="flex items-start justify-between pt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <div className="mt-2 text-2xl font-bold text-foreground">{stat.value}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
                      <Icon />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Subject performance</CardTitle>
              <CardDescription>Latest internal assessment marks out of 100.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {subjectMarks.map((subject) => (
                <div key={subject.code}>
                  <div className="mb-2 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {subject.subject}
                      </div>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                    </div>
                    <div className="shrink-0 text-sm font-semibold text-foreground">
                      {subject.marks}%
                    </div>
                  </div>
                  <Progress value={subject.marks} aria-label={`${subject.subject} marks`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Contact and student details on record.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{detail.label}</p>
                        <div className="mt-1 text-sm font-medium text-foreground">{detail.value}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian details</CardTitle>
                <CardDescription>Primary emergency contact registered with VVCE.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <UsersRound className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Guardian name</p>
                    <div className="mt-1 text-sm font-medium text-foreground">Prakash S</div>
                    <p className="mt-1 text-xs text-muted-foreground">Father</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Guardian mobile number</p>
                    <div className="mt-1 text-sm font-medium text-foreground">+91 99887 76655</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <UserRound className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency contact</p>
                    <div className="mt-1 text-sm font-medium text-foreground">Primary contact</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
