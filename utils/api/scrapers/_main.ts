import PartneredAllowanceScraper from './partneredAllowanceScraper'
import PartneredAndOasScraper from './partneredAndOasScraper'
import PartneredNoOasScraper from './partneredNoOasScraper'
import PartneredSurvivorScraper from './partneredSurvivorScraper'
import SingleScraper from './singleScraper'

const singleScraper = new SingleScraper()
singleScraper.main().then(() => {})

const partneredAndOasScraper = new PartneredAndOasScraper()
partneredAndOasScraper.main().then(() => {})

const partneredNoOasScraper = new PartneredNoOasScraper()
partneredNoOasScraper.main().then(() => {})

const partneredAllowance = new PartneredAllowanceScraper()
partneredAllowance.main().then(() => {})

const partneredSurvivor = new PartneredSurvivorScraper()
partneredSurvivor.main().then(() => {})
