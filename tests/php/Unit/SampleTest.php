<?php
/**
 * Sample test to prevent CI failures.
 *
 * @package Forjeon
 */

namespace Forjeon\Tests\php\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Sample test class.
 */
class SampleTest extends TestCase {

	/**
	 * Test that true is true.
	 * This is a placeholder test to prevent CI failures.
	 */
	public function test_true_is_true(): void {
		$this->assertTrue( true );
	}

	/**
	 * Test basic math.
	 */
	public function test_basic_math(): void {
		$this->assertEquals( 4, 2 + 2 );
		$this->assertEquals( 0, 2 - 2 );
	}

	/**
	 * Test string operations.
	 */
	public function test_string_operations(): void {
		$this->assertEquals( 'Hello World', 'Hello' . ' ' . 'World' );
		$this->assertStringContainsString( 'Hello', 'Hello World' );
	}
}
