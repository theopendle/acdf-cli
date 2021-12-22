module.exports = {
    new: (argv) => {
        console.log(`Creating new package ${argv.number}-${argv.name}.xml`)
    },
    number: (argv) => {
        console.log(`MOVE`)
    }
}