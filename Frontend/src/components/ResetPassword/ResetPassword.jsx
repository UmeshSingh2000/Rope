import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

const URL = import.meta.env.VITE_BACKENDAPI_URL;

const ResetPassword = () => {
  const [data, setData] = useState({
    email: "",
    OTP: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [sendOTPButtonState, setSendOTPButtonState] = useState(true);
  const [verifyOTPButtonState, setVerifyOTPButtonState] = useState(false);
  const [passwordState, setPasswordState] = useState(false);

  const handleCheckEmail = async () => {
    const { email } = data;

    if (!email) {
      toast.error("Please enter your email.");
    }
    const response = await axios.post(
      `${URL}/forgetPassword`,
      { email },
      { withCredentials: true }
    );
    if (response.status === 200) {
      toast.success("OTP sent to your email!");
    }
    setSendOTPButtonState(false);
    setVerifyOTPButtonState(true);
  };

  const handleVerifyOTP = async () => {
    const { OTP } = data;
    if (!OTP) {
      toast.error("Please enter your OTP.");
    }
    const response = await axios.post(
      `${URL}/verifyOTP`,
      { OTP },
      { withCredentials: true }
    );
    if (response.status === 200) {
      toast.success("OTP verified successfully!");
      setVerifyOTPButtonState(false);
      setPasswordState(true);
    }
  };

    const handleChangePassword = async () => {
      const { newPassword, confirmPassword } = data;
      if (!newPassword || !confirmPassword) {
        toast.error("Please enter your new password.");
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
      }
      const response = await axios.post(
        `${URL}/resetPassword`,
        { newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Password changed successfully!");
      }
  };

  return (
    <div className="text-right">
      <Dialog>
        <DialogTrigger asChild>
          <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Forgot password?
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot your password?</DialogTitle>
            <DialogDescription>
              Enter your email and we’ll send you a reset link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => {
                setData({ ...data, ["email"]: e.target.value });
              }}
              disabled={!sendOTPButtonState}
            />
            <Button
              className={`w-full cursor-pointer ${
                sendOTPButtonState ? "block" : "hidden"
              }`}
              onClick={handleCheckEmail}
            >
              Send OTP
            </Button>

            <Input
            className={`${
              verifyOTPButtonState ? "block" : "hidden"}`}
              type="text"
              placeholder="Enter OTP"
              value={data.OTP}
              onChange={(e) => setData({ ...data, ["OTP"]: e.target.value })}
            />
            <Button
              className={`w-full cursor-pointer ${
                verifyOTPButtonState ? "block" : "hidden"
              }`}
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>


            <Input
            className={`${
              passwordState ? "block" : "hidden"}`}
              type="text"
              placeholder="Enter Your New Password"
              value={data.newPassword}
              onChange={(e) => setData({ ...data, ["newPassword"]: e.target.value })}
              disabled={!passwordState}
            />
            <Input
            className={`${
              passwordState ? "block" : "hidden"}`}
              type="text"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, ["confirmPassword"]: e.target.value })}
              disabled={!passwordState}
            />
            <Button
              className={`w-full cursor-pointer ${
                passwordState ? "block" : "hidden"
              }`}
              onClick={handleChangePassword}
            >
              Confirm Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
