import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTwitterX, BsGithub } from "react-icons/bs"

export default function FooterCom() {
  return (
    <Footer className=' border border-t-8 border-teal-400'>
        <div className=' w-full max-w-7xl mx-auto'>
            <div className=' grid w-full justify-between md:flex sm:grid-cols-1 mx-3'>

                <div className=' flex justify-center items-center'>
                    <Link to='/' className=' self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className=' px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Bloggo</span> Blogging made Simple
                    </Link>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                        <Footer.Title title='About'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='#'>
                                Link1
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link2
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link3
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title='Follow Us'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='#'>
                                Link1
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link2
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link3
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title='Legal'/>
                        <Footer.LinkGroup col>
                            <Footer.Link href='#'>
                                Link1
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link2
                            </Footer.Link>

                            <Footer.Link href='#'>
                                Link3
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
                
            </div>

            <Footer.Divider/>
            <div className='flex flex-col justify-center items-center'>
                <Footer.Copyright href='#' by="Bloggo" year={new Date().getFullYear()}/>
                <div className='flex flex-row gap-2 mt-2 pb-2'>
                    <Footer.Icon href='#' icon={BsFacebook}/>
                    <Footer.Icon href='#' icon={BsInstagram}/>
                    <Footer.Icon href='#' icon={BsGithub}/>
                    <Footer.Icon href='#' icon={BsTwitterX}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}
