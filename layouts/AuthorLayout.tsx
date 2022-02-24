import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import { ReactNode } from 'react'
import { AuthorFrontMatter } from 'types/AuthorFrontMatter'

interface Props {
  children: ReactNode
  frontMatter: AuthorFrontMatter
}

export default function AuthorLayout({ frontMatter }: Props) {
  const { name, avatar, occupation, company } = frontMatter

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            <Image
              src={avatar}
              alt="avatar"
              width="192px"
              height="192px"
              className="h-48 w-48 rounded-full"
            />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
          </div>
          <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2">
            Hey, I'm Ben. 👋
            <br />
            <br />
            I'm an Architect Developer at Theodo UK. We help companies build business-driven
            products in record time. Feel free to{' '}
            <a
              href="https://www.theodo.co.uk/contact?hsLang=en-gb"
              target="_blank"
              className="text-primary-500 underline hover:text-primary-300"
              rel="noreferrer"
            >
              reach out
            </a>{' '}
            if you think we can help with your current challenge.
            <br />
            <br />
            Some bits about me. I have a Masters in Physics from Oxford. I have experience across
            the full stack and entire software development lifecycle. I've delivered high-quality,
            scalable products to production and hope to continue doing so!
            <br />
            <br /> I'm a qualified AWS Developer Associate and Cloud Practitioner. I'm also a
            qualified Circl Leader as a Coach.
          </div>
        </div>
      </div>
    </>
  )
}
