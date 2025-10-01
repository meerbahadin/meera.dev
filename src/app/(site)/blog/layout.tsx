import Link from 'next/link'

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container pt-18 max-w-2xl'>
      <nav className="mb-8">
        <Link
          href="/blog"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          ← Back to Blog
        </Link>
      </nav>
      <div className='prose prose-zinc dark:prose-invert prose-h1:scroll-m-20 prose-h1:text-2xl prose-h1:font-semibold prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:font-medium prose-h3:scroll-m-20 prose-h3:text-base prose-h3:font-medium prose-h4:scroll-m-20 prose-h5:scroll-m-20 prose-h6:scroll-m-20 prose-strong:font-medium prose-table:block prose-table:overflow-y-auto'>
        {children}
      </div>
    </div>
  )
}
