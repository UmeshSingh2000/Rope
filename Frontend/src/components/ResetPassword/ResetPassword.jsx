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
      const response = await axios.post(`${URL}/forgetPassword`, { email }, { withCredentials: true });
      if (response.status === 200) {
        toast.success(response.data.message);
        setSendOTPButtonState(false);
        setVerifyOTPButtonState(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
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
      const response = await axios.post(`${URL}/verifyOTP`, { OTP, email }, { withCredentials: true });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setVerifyOTPButtonState(false);
        setPasswordState(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
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
      const response = await axios.post(`${URL}/resetPassword`, { newPassword }, { withCredentials: true });
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setData({ email: "", OTP: "", newPassword: "", confirmPassword: "" });
        setSendOTPButtonState(true);
        setVerifyOTPButtonState(false);
        setPasswordState(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right mt-2">
      <Dialog>
        <DialogTrigger asChild>
          <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
            Forgot password?
          </span>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white rounded-3xl shadow-2xl max-w-sm w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Reset Password</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Enter your email to receive an OTP and reset your password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={!sendOTPButtonState}
              className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {sendOTPButtonState && !loading && (
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl" onClick={handleCheckEmail}>
                Send OTP
              </Button>
            )}

            {verifyOTPButtonState && (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={data.OTP}
                  onChange={(e) => setData({ ...data, OTP: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {!loading && (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl" onClick={handleVerifyOTP}>
                    Verify OTP
                  </Button>
                )}
              </>
            )}

            {passwordState && (
              <>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={data.newPassword}
                  onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {!loading && (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl" onClick={handleChangePassword}>
                    Confirm Change Password
                  </Button>
                )}
              </>
            )}

            {loading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPassword;
