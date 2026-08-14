export function errorHandler(
    error,
    req,
    res,
    next
) {

    console.error(error);

    if (error.code === "23505") {

        return res.status(409).json({

            success: false,

            message:
                "A record with this value already exists"

        });

    }


    res.status(500).json({

        success: false,

        message:
            "Internal server error"

    });

}