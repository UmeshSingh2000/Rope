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
import Loader from "@/components/Loader/Loader";

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
  const [loading, setLoading] = useState(false);

  const handleCheckEmail = async () => {
    setLoading(true);
    const { email } = data;
    try {
      if (!email) {
        toast.error("Please enter your email.");
        return;
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
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { OTP, email } = data;
      if (!OTP) {
        toast.error("Please enter your OTP.");
        return;
      }
      const response = await axios.post(
        `${URL}/verifyOTP`,
        { OTP, email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setVerifyOTPButtonState(false);
        setPasswordState(true);
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const { newPassword, confirmPassword } = data;
      if (!newPassword || !confirmPassword) {
        toast.error("Please enter your new password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      const response = await axios.post(
        `${URL}/resetPassword`,
        { newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Password changed successfully!");
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
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
               {loading?<div className='flex justify-center'><Loader /></div>:"Send OTP"}  
            </Button>

            <Input
              // className={`${verifyOTPButtonState ? "block" : "hidden"}`}
              type="text"
              placeholder="Enter OTP"
              value={data.OTP}
              onChange={(e) => setData({ ...data, ["OTP"]: e.target.value })}
              disabled={!verifyOTPButtonState}
            />
            <Button
              className={`w-full cursor-pointer ${
                verifyOTPButtonState ? "block" : "hidden"
              }`}
              onClick={handleVerifyOTP}
            >
              {loading?<div className='flex justify-center'><Loader /></div>:"Verify OTP"}
            </Button>

            <Input
              className={`${passwordState ? "block" : "hidden"}`}
              type="text"
              placeholder="Enter Your New Password"
              value={data.newPassword}
              onChange={(e) =>
                setData({ ...data, ["newPassword"]: e.target.value })
              }
              disabled={!passwordState}
            />
            <Input
              className={`${passwordState ? "block" : "hidden"}`}
              type="text"
              placeholder="Confirm Password"
              value={data.confirmPassword}
              onChange={(e) =>
                setData({ ...data, ["confirmPassword"]: e.target.value })
              }
              disabled={!passwordState}
            />
            <Button
              className={`w-full cursor-pointer ${
                passwordState ? "block" : "hidden"
              }`}
              onClick={handleChangePassword}
            >
              {loading?<div className='flex justify-center'><Loader /></div>:"Confirm Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
