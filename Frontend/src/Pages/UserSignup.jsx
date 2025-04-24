import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '@/components/Loader/Loader'
const URL = import.meta.env.VITE_BACKENDAPI_URL

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userName: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, email, password, userName } = formData;
      if (!name) {
        toast.error('Please Enter Your Name.');
        return;
      }
      if (!email) {
        toast.error('Please Enter Your Email.');
        return;
      }
      if (!password) {
        toast.error('Please Enter Your Password.');
        return;
      }
      if (!userName) {
        toast.error('Please Enter Username.');
        return;
      }
      const response = await axios.post(`${URL}/userSignup`, formData);


      if (response.status === 201) {
        toast.success('Signup successful! Please log in.');
        navigate('/');
      }
    } catch (error) {
      if (!error.response) {
        toast.error("Can't connect to server. Please try again later.");
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.response.data.message || "Login failed.");
      }
    } finally {

      setLoading(false);

    }
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4">
      <Card className="bg-zinc-900 border border-zinc-800 text-white w-full max-w-sm rounded-3xl shadow-2xl p-6 transition-all">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Create Your Account</h2>
          <p className="text-zinc-400 text-sm">Sign up to get started with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <CardContent className="p-0 space-y-5">
            <div className='flex gap-2'>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">UserName</label>
                <Input
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="John123"
                  className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email address</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Password</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            {
              loading ? <div className='flex justify-center'><Loader /></div> :
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all py-2 rounded-md shadow-md"
                >
                  Sign Up
                </Button>
            }

            <div className="text-center text-sm text-zinc-400 mt-4">
              Already have an account?{' '}
              <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                Log In
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default UserSignup
