<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit54d37b2f7505e8c7f3273263498a8abe
{
    public static $prefixLengthsPsr4 = array (
        'D' => 
        array (
            'Damar\\ColabAdminPhp\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Damar\\ColabAdminPhp\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit54d37b2f7505e8c7f3273263498a8abe::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit54d37b2f7505e8c7f3273263498a8abe::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit54d37b2f7505e8c7f3273263498a8abe::$classMap;

        }, null, ClassLoader::class);
    }
}