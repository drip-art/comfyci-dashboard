import Head from 'next/head'
import { ThemeModeScript } from 'flowbite-react'


export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <>
            <Head>
                <title>ComfyUI CI/CD</title>
                <meta
                    name="description"
                    content="ComfyUI CI/CD Dashboard for running workflows."
                ></meta>

                <ThemeModeScript />

            </Head>

            <main>{children}</main>

        </>
    )
}