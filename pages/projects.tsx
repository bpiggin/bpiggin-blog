import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import projectsData from '@/data/projectsData'
import siteMetadata from '@/data/siteMetadata'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description="Things I have built" />
      {projectsData.map((project) => (
        <div key={project.title} className="flex w-full flex-col items-center md:flex-row">
          <div className="w-full">
            <p>{project.title}</p>
            <p className="text-sm text-primary-600 dark:text-primary-400">{project.description}</p>
          </div>
          <div className="mt-2 flex w-full justify-start md:w-fit md:justify-end">
            <Link
              href={project.href}
              className="whitespace-nowrap text-sm text-primary-900 hover:text-primary-600 dark:text-primary-100 dark:hover:text-primary-200"
              aria-label={`Explore "${project.title}"`}
            >
              🔗 projects/cellular-automata &rarr;
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}
