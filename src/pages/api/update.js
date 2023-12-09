const Client = require("ssh2").Client;

function updateHost(host) {
    return new Promise((resolve, reject) => {
        const conn = new Client();

        const timeoutId = setTimeout(() => {
            conn.end();
            reject({ host, status: 500, message: "Timeout error" });
        }, 10000);

        conn.on("ready", () => {
            clearTimeout(timeoutId); // Clear the timeout as the connection is ready

            conn.exec(
                "cd btns && nohup sudo ./update.sh > update.log 2> update.err < /dev/null &",
                (err, stream) => {
                    if (err) {
                        reject({
                            host,
                            status: 500,
                            message: `Command execution error: ${err.message}`,
                        });
                    } else {
                        stream
                            .on("close", (code, signal) => {
                                conn.end();
                                if (code === 0) {
                                    resolve({ host, status: 200 });
                                } else {
                                    reject({
                                        host,
                                        status: 500,
                                        message: `Command failed with code ${code}`,
                                    });
                                }
                            })
                            .on("data", (data) => {
                                // Handle command output if needed
                            })
                            .stderr.on("data", (data) => {
                                // Handle stderr output if needed
                            });
                    }
                }
            );
        });

        conn.on("error", (err) => {
            reject({
                host,
                status: 500,
                message: `Connection error: ${err.message}`,
            });
        });

        conn.connect({
            host,
            port: 22,
            username: "admin",
            password: "admin",
        });
    });
}

async function handler(req, res) {
    if (req.method == "POST") {
        // Parse the request body
        const { nodes } = JSON.parse(req.body);
        const promises = nodes.map((node) => updateHost(node));
        try {
            await Promise.allSettled(promises);
            return res.status(200).json({
                message: "Nodes Updated",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Nodes Update Failed",
            });
        }
    } else {
        return res.status(405).json({
            message: `${req.method} method not allowed on this route`,
        });
    }
}

export default handler;
