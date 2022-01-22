import PartneredAfsScraper from './partneredAfsScraper'
import PartneredAlwScraper from './partneredAlwScraper'
import PartneredAndOasScraper from './partneredAndOasScraper'
import PartneredNoOasScraper from './partneredNoOasScraper'
import SingleScraper from './singleScraper'

const singleScraper = new SingleScraper()
singleScraper.main().then(() => {})

const partneredAndOasScraper = new PartneredAndOasScraper()
partneredAndOasScraper.main().then(() => {})

const partneredNoOasScraper = new PartneredNoOasScraper()
partneredNoOasScraper.main().then(() => {})

const partneredAlw = new PartneredAlwScraper()
partneredAlw.main().then(() => {})

const partneredAfs = new PartneredAfsScraper()
partneredAfs.main().then(() => {})
