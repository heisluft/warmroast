# WarmRoast
**Note**: This fork is a more bare version of the original and may or may not be useful for anyone
except me.


WarmRoast is an easy-to-use CPU sampling tool for JVM applications, but particularly suited for Minecraft servers/clients.

* Adjustable sampling frequency.
* Web-based — perform the profiling on a remote server and view the results in your browser.
 * Collapse and expand nodes to see details.
 * Easily view CPU usage per method at a glance.
 * Hover to highlight all child methods as a group.
 * See the percentage of CPU time for each method relative to its parent methods.
 * Maintains style and function with use of "File -> Save As" (in tested browsers).

Java 8 and above is required to use WarmRoast.

## Changes of this fork
- Switched to Gradle
- Requires Java 8 to run
- It is no longer required to know your jdk location, WarmRoast should work out of the box now
- Mappings are not supported for now, MCP mappings are not applicable for my work and add unneeded clutter


## Screenshots

![Sample output](http://i.imgur.com/Iy7kJ7f.png)

## Usage

1. Download WarmRoast.
2. In your shell, run the following command:
```java -jar warmroast-1.1.0--thread "Server thread"```

**Note:** The example command line below includes `--thread "Server thread"`, which filters all threads but the main server thread. You can remove it to show all threads.

## Parameters

    Usage: warmroast [options]
      Options:
        --bind
           The address to bind the HTTP server to
           Default: 0.0.0.0
           
        -h, --help
           Default: false
           
        --interval
           The sample rate, in milliseconds
           Default: 100
           
        --name
           The name of the VM to attach to
           
        --pid
           The PID of the VM to attach to
           
        -p, --port
           The port to bind the HTTP server to
           Default: 23000
           
        -t, --thread
           Optionally specify a thread to log only
           
        --timeout
           The number of seconds before ceasing sampling (optional)

Hint: `--thread "Server thread"` is useful for Minecraft servers.

## License

The project is licensed under the GNU General Public License, version 3.
