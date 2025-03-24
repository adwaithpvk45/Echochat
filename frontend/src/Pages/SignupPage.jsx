import { Eye,EyeOff, Loader2, MessageSquare } from 'lucide-react'
import React from 'react'
import { Form,Formik,Field } from 'formik'
import { useState } from 'react'
import {TextField} from "@mui/material"
import { useAuthStore } from '../store/useAuthStore'
import {Link} from "react-router-dom"
import AuthImagePattern from '../components/AuthImagePattern'
import toast from "react-hot-toast"

const SignupPage = () => {
  const [showPassword,setShowPassword] = useState(false)
 
  const validate = (values) => {
    const errors = {};
    console.log(values)
    if (!values.fullName) {
      errors.fullName = 'Name is required';
      toast.error(errors.fullName);
    }
    if (!values.email) {
      errors.email = 'Email is required';
      toast.error(errors.email);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
      toast.error(errors.email);
    }
    if (!values.password) {
      errors.password = 'Password is required';
      toast.error(errors.password);
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      toast.error(errors.password);
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = 'Must contain at least one uppercase letter';
      toast.error(errors.password);
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = 'Must contain at least one number';
      toast.error(errors.password);
    }
    return errors;
  };

  const { signUp} = useAuthStore()

  return (
    <>
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
       <div className='w-full max-w-md space-y-8'>
        <div className='text-center mb-8'>
          <div className="flex flex-col items-center gap-2 group">
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary'/>
            </div>
            <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
            <p className='text-base-content/60'>Get started with your free account</p>
          
    <button onClick={() => toast.success("Glad to meet Uuu")} className="btn">
  Hi 🎉 
</button>
          </div>
        </div>
        <Formik 
  initialValues={{ fullName: '', email: '', password: '' }}
  validate={validate}
  validateOnChange={false}
  onSubmit={  async(values, { setSubmitting,resetForm}) => {   
   try{
    console.log(values)
    signUp(values);
    setSubmitting(false);
  }catch(error){
    toast.error("SignUp unsuccessfull!")
  }
  }}
>
             {({handleSubmit,isSubmitting})   =>
                      (<Form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <Field as={TextField} className="w-full pl-10" variant="standard" type="text" name="fullName" label="FullName"></Field>
            </div>
            <div>
             <Field type="email" name="email" className="w-full pl-10" as={TextField} variant="standard" label="Email"></Field>
            </div>
            <div className='relative'>
              <Field type={showPassword?"text":"password"} name="password" as={TextField} className="w-full pl-10" variant="standard" label="Password"></Field>
              <button type='button' className='absolute right-2 top-5 text-gray-500' onClick={()=>{setShowPassword(!showPassword)}}>
                {showPassword?<EyeOff className='size-5 text-base-content/40'/>:<Eye className='size-5 text-base-content/40'/>}
              </button>
            </div>
            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-full pl-10" type="submit" disabled={isSubmitting}>
              {isSubmitting?(<>
              <Loader2 className='size-5 animate-spin'/>
              Loading ...
              </>):(
                "Create Account" 
              )}</button>
          </Form>)}
        </Formik>
        <div className='text-center'>
          <p className='text-base-content/60'>
            Already have an account?{"  "}
            <Link to="/login" className="link link-primary">Sign in</Link>
          </p>
          </div>
        </div>
       </div>
       <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones"
        />
      </div>
    </>
  )
}

export default SignupPage

