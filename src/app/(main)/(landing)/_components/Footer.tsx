import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#FFF8F2] text-center py-8">
    <div className="container mx-auto">
      <h3 className="text-black font-bold mb-4">Follow me:</h3>
      <div className="flex justify-center space-x-4 mb-4">
      <Link href="https://x.com/16_shivang" className="p-2 border rounded-full hover:bg-[#FDBA74] h-10 w-10">
      <FontAwesomeIcon icon={faXTwitter} />        
        </Link>
        <Link href="https://www.linkedin.com/in/shivang-yadav-b83979257" className="p-2 border rounded-full hover:bg-[#FDBA74] h-10 w-10">
          <FontAwesomeIcon icon={faLinkedin}  />
        </Link>
        <Link href="https://github.com/shivang-16/find_your_job.web" className="p-2 border rounded-full hover:bg-[#FDBA74] h-10 w-10">
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </div>
      <p className="text-orange-600 mb-2">
        All rights reserved to JobFlow.
      </p>
      {/* <div className="flex justify-center space-x-4 text-gray-600">
        <a href="#" className="hover:underline">Terms & Conditions</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div> */}
    </div>
  </footer>
    )
}

export default Footer