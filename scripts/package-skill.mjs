import { createWriteStream } from 'node:fs'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZipArchive } from 'archiver'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const skillDirectory = path.join(projectRoot, 'workbuddy-skill', 'kithrelay')
const artifactDirectory = path.join(projectRoot, 'artifacts')
const publicDirectory = path.join(projectRoot, 'public', 'downloads')
const artifactPath = path.join(artifactDirectory, 'kithrelay-workbuddy.zip')
const publicPath = path.join(publicDirectory, 'kithrelay-workbuddy.zip')

await mkdir(artifactDirectory, { recursive: true })
await mkdir(publicDirectory, { recursive: true })
await rm(artifactPath, { force: true })

await new Promise((resolve, reject) => {
  const output = createWriteStream(artifactPath)
  const archive = new ZipArchive({ zlib: { level: 9 } })

  output.on('close', resolve)
  output.on('error', reject)
  archive.on('warning', reject)
  archive.on('error', reject)
  archive.pipe(output)
  archive.directory(skillDirectory, false)
  archive.finalize()
})

await copyFile(artifactPath, publicPath)
console.log(`Packaged WorkBuddy skill: ${path.relative(projectRoot, artifactPath)}`)
